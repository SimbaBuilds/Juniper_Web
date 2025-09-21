1. Please create add a Medical Records Section to the bottom of the wellness page.

2. Move the Upload Medical Records components and logic out of "Advanced" and into this section.

3.  Add an area to display uploaded medical records.  It should display user record medatata from table below.  

    create table public.medical_records (
    id uuid not null default gen_random_uuid (),
    user_id uuid not null,
    title text not null,
    original_file_type text not null,
    original_filename text null,
    file_size_bytes integer null,
    num_pages integer not null,
    status text not null default 'processing'::text,
    upload_url text null,
    summary text null,
    metadata jsonb null default '{}'::jsonb,
    created_at timestamp with time zone null default now(),
    updated_at timestamp with time zone null default now(),



4. Add messaging: “Provide medical records to Juniper so it can provide valuable insights and conversation around your health data”

5. Add tooltip: “Upload medical records to Juniper: if you have MyChart, look for a section like “Sharing Hub” or “Download All”. Download on mobile or desktop and upload directly in Juniper’s wellness page/screen.


