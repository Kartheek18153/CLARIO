-- ================================================
-- CHAT APP DATABASE SETUP (Safe to run multiple times)
-- ================================================

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    profile_pic TEXT,
    status TEXT,
    strikes INT DEFAULT 0,
    muted_until timestamptz,
    banned BOOLEAN DEFAULT FALSE,
    created_at timestamptz DEFAULT now()
);

-- ROOMS TABLE
CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    name TEXT,
    type TEXT
);

-- MESSAGES TABLE
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id TEXT,
    sender_id UUID REFERENCES users(id),
    message TEXT,
    image_url TEXT,
    created_at timestamptz DEFAULT now(),
    is_deleted BOOLEAN DEFAULT FALSE
);

-- STORIES TABLE
CREATE TABLE IF NOT EXISTS stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    media_url TEXT,
    created_at timestamptz DEFAULT now(),
    expires_at timestamptz
);

-- BAD WORDS TABLE
CREATE TABLE IF NOT EXISTS bad_words (
    id SERIAL PRIMARY KEY,
    word TEXT UNIQUE
);

-- STRIKE LOGS
CREATE TABLE IF NOT EXISTS strike_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    message_id UUID REFERENCES messages(id),
    bad_word TEXT,
    strike_count INT,
    created_at timestamptz DEFAULT now()
);

-- PRESENCE LOGS
CREATE TABLE IF NOT EXISTS presence_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    status TEXT,
    timestamp timestamptz DEFAULT now()
);

-- INSERT BAD WORDS (safe, ignores duplicates)
INSERT INTO bad_words (word) VALUES
('asshole'), ('bastard'), ('bitch'), ('bloody'), ('bollocks'), ('bugger'),
('cock'), ('cunt'), ('crap'), ('damn'), ('dick'), ('faggot'), ('fuck'),
('goddamn'), ('jerk'), ('moron'), ('motherfucker'), ('piss'), ('prick'),
('retard'), ('shit'), ('slut'), ('sucker'), ('twat'), ('wanker'), ('whore'),
('arsehole'), ('cocksucker'), ('jackass'), ('sonofabitch'), ('hell')
ON CONFLICT (word) DO NOTHING;
