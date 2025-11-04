// Supabase handles schema, but this file helps you remember structure:
export const userSchema = {
  id: "uuid",
  username: "text",
  email: "text",
  password: "text",
  profile_pic: "text",
  status: "text",
  strikes: "integer",
  muted_until: "timestamp",
  banned: "boolean",
};
