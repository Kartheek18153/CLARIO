import { supabase } from "../config/supabase.js";
import cloudinary from "../config/cloudinary.js";

// ✅ Create a new story
export const createStory = async (req, res) => {
  try {
    const file = req.file.path;
    const result = await cloudinary.uploader.upload(file);

    // Set expiration to 24 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const { data, error } = await supabase
      .from("stories")
      .insert([{
        user_id: req.user.id,
        media_url: result.secure_url,
        expires_at: expiresAt.toISOString()
      }])
      .select();

    if (error) {
      console.error("Supabase error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: "Story created successfully",
      story: data[0],
    });
  } catch (err) {
    console.error("Error creating story:", err);
    res.status(500).json({ error: "Failed to create story" });
  }
};

// ✅ Get current user's stories
export const getUserStories = async (req, res) => {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("stories")
      .select(`
        id,
        media_url,
        created_at,
        expires_at,
        users!inner(id, username, profile_pic)
      `)
      .eq("user_id", req.user.id)
      .gt("expires_at", now)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      message: "User stories fetched successfully",
      stories: data,
    });
  } catch (err) {
    console.error("Error fetching user stories:", err);
    res.status(500).json({ error: "Failed to fetch user stories" });
  }
};

// ✅ Get all active stories from all users
export const getAllStories = async (req, res) => {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("stories")
      .select(`
        id,
        media_url,
        created_at,
        expires_at,
        users!inner(id, username, profile_pic)
      `)
      .gt("expires_at", now)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    // Group stories by user
    const storiesByUser = data.reduce((acc, story) => {
      const userId = story.users.id;
      if (!acc[userId]) {
        acc[userId] = {
          user: {
            id: story.users.id,
            username: story.users.username,
            profile_pic: story.users.profile_pic,
          },
          stories: [],
        };
      }
      acc[userId].stories.push({
        id: story.id,
        media_url: story.media_url,
        created_at: story.created_at,
        expires_at: story.expires_at,
      });
      return acc;
    }, {});

    res.status(200).json({
      message: "All stories fetched successfully",
      stories: Object.values(storiesByUser),
    });
  } catch (err) {
    console.error("Error fetching all stories:", err);
    res.status(500).json({ error: "Failed to fetch stories" });
  }
};

// ✅ Delete a specific story by ID (only by owner)
export const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    // First, check if the story belongs to the user
    const { data: story, error: fetchError } = await supabase
      .from("stories")
      .select("id, user_id, media_url")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .single();

    if (fetchError || !story) {
      return res.status(404).json({ error: "Story not found or access denied" });
    }

    // Delete from Supabase
    const { error: deleteError } = await supabase
      .from("stories")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user.id);

    if (deleteError) {
      console.error("Supabase error:", deleteError.message);
      return res.status(400).json({ error: deleteError.message });
    }

    // Optionally, delete from Cloudinary (extract public_id from URL)
    try {
      const publicId = story.media_url.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    } catch (cloudinaryError) {
      console.warn("Failed to delete from Cloudinary:", cloudinaryError.message);
      // Don't fail the request if Cloudinary deletion fails
    }

    res.status(200).json({
      message: "Story deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting story:", err);
    res.status(500).json({ error: "Failed to delete story" });
  }
};

// ✅ Delete expired stories and clean up Cloudinary (can be called periodically)
export const deleteExpiredStories = async () => {
  try {
    const now = new Date().toISOString();

    // First, get expired stories to clean up Cloudinary
    const { data: expiredStories, error: fetchError } = await supabase
      .from("stories")
      .select("id, media_url")
      .lt("expires_at", now);

    if (fetchError) {
      console.error("Error fetching expired stories:", fetchError.message);
    } else if (expiredStories && expiredStories.length > 0) {
      // Delete from Cloudinary
      for (const story of expiredStories) {
        try {
          const publicId = story.media_url.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryError) {
          console.warn(`Failed to delete expired story from Cloudinary (ID: ${story.id}):`, cloudinaryError.message);
        }
      }
    }

    // Delete from Supabase
    const { error } = await supabase
      .from("stories")
      .delete()
      .lt("expires_at", now);

    if (error) {
      console.error("Error deleting expired stories:", error.message);
    } else {
      console.log(`Expired stories deleted successfully (${expiredStories?.length || 0} cleaned up)`);
    }
  } catch (err) {
    console.error("Error in deleteExpiredStories:", err);
  }
};

// ✅ Manual cleanup function to delete all orphaned Cloudinary files (admin function)
export const cleanupCloudinaryStorage = async (req, res) => {
  try {
    // Only allow admin access (you might want to add proper admin authentication)
    // For now, this is a basic implementation - you should secure this endpoint

    // Get all stories from database
    const { data: allStories, error: fetchError } = await supabase
      .from("stories")
      .select("id, media_url");

    if (fetchError) {
      console.error("Error fetching all stories:", fetchError.message);
      return res.status(500).json({ error: "Failed to fetch stories for cleanup" });
    }

    // Get all resources from Cloudinary
    const cloudinaryResources = await cloudinary.api.resources({
      type: 'upload',
      prefix: '', // Get all resources
      max_results: 500
    });

    const dbUrls = new Set(allStories.map(story => story.media_url));
    const orphanedFiles = [];

    // Find files in Cloudinary that are not in database
    for (const resource of cloudinaryResources.resources) {
      if (!dbUrls.has(resource.secure_url)) {
        orphanedFiles.push({
          public_id: resource.public_id,
          url: resource.secure_url
        });
      }
    }

    // Delete orphaned files
    let deletedCount = 0;
    for (const file of orphanedFiles) {
      try {
        await cloudinary.uploader.destroy(file.public_id);
        deletedCount++;
      } catch (deleteError) {
        console.warn(`Failed to delete orphaned file ${file.public_id}:`, deleteError.message);
      }
    }

    res.status(200).json({
      message: "Cloudinary cleanup completed",
      totalStoriesInDB: allStories.length,
      totalFilesInCloudinary: cloudinaryResources.resources.length,
      orphanedFilesFound: orphanedFiles.length,
      filesDeleted: deletedCount
    });

  } catch (err) {
    console.error("Error in cleanupCloudinaryStorage:", err);
    res.status(500).json({ error: "Failed to cleanup Cloudinary storage" });
  }
};
