Please:

1. Review the health_dashboard markdown
2. Review the example daily metrics csv record 
3. Strategically review the raw lake wearables_data csv without reading the entire thing as it is too much data to read in its entirety.
4. Create a “Wellness” protected route and associated hook
5. Build out the page and logic according to the markdown using the edge function and necessary supabase interaction following existing supabase interaction and styling patterns in the codebase
    
    Specifications:
    
    - Use Rechart
    - Display any resources with “Health and Wellness” tag in “Resources” section
    - Basic filtering and sorting options with prefs cached in browser
        - Can sort/filter displays or all metrics as well as toggle on/off displays of resources and automations
    - Display “Tip: Add tag “Health and Wellness” to a resource to have it appear on this screen” (Use same blue tones as the tip in the repo screen)