-- Run this SQL in your Neon database to enable email alerts

-- User alerts table
CREATE TABLE IF NOT EXISTS user_alerts (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  keywords TEXT DEFAULT '',
  agencies TEXT DEFAULT '',
  min_budget INTEGER DEFAULT 0,
  email_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_alerts_user_id ON user_alerts(user_id);

-- RFP cache table (to track which RFPs we've already sent)
CREATE TABLE IF NOT EXISTS rfp_cache (
  id SERIAL PRIMARY KEY,
  sam_id TEXT NOT NULL UNIQUE,
  title TEXT,
  agency TEXT,
  posted_date TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rfp_cache_sam_id ON rfp_cache(sam_id);

-- Insert sample alert for testing (replace with real user ID)
-- INSERT INTO user_alerts (user_id, keywords, agencies, email_enabled) 
-- VALUES ('user_123', 'IT software cybersecurity', 'VA, DHS, USDA', true);
