/*
  # Blood Grouping App Database Schema

  1. New Tables
    - `blood_reports`
      - `id` (uuid, primary key) - Unique identifier for each report
      - `user_id` (uuid, foreign key) - References auth.users
      - `blood_type` (text) - Determined blood type (A+, A-, B+, B-, AB+, AB-, O+, O-)
      - `image_url` (text) - URL to the uploaded test card image
      - `confidence_score` (numeric) - Confidence level of the analysis (0-1)
      - `analysis_data` (jsonb) - Detailed analysis results including section results
      - `created_at` (timestamptz) - Timestamp of report creation
      - `updated_at` (timestamptz) - Timestamp of last update

  2. Security
    - Enable RLS on `blood_reports` table
    - Add policy for users to read their own reports
    - Add policy for users to insert their own reports
    - Add policy for users to update their own reports
    - Add policy for users to delete their own reports

  3. Indexes
    - Index on user_id for faster query performance
    - Index on created_at for sorting by date
*/

CREATE TABLE IF NOT EXISTS blood_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  blood_type text NOT NULL,
  image_url text NOT NULL,
  confidence_score numeric(3, 2) DEFAULT 0.00,
  analysis_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blood_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own reports"
  ON blood_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports"
  ON blood_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports"
  ON blood_reports FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports"
  ON blood_reports FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS blood_reports_user_id_idx ON blood_reports(user_id);
CREATE INDEX IF NOT EXISTS blood_reports_created_at_idx ON blood_reports(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_blood_reports_updated_at
  BEFORE UPDATE ON blood_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();