
**`wearables_data` - Raw Time-Series Storage**
- **Purpose**: Append-only historical record of ALL incoming data points from wearables APIs
- **Scalability**: Handles millions of rows (heart rate every minute, stress every hour, etc.)
- **Data Integrity**: Preserves original API responses without transformation
- **Flexibility**: JSONB allows different services to store their unique metrics without schema changes
- **Audit Trail**: Complete history for debugging and reprocessing

**`health_metrics_daily` - Aggregated Performance Layer**
- **Query Speed**: Dashboard loads instantly (1 row/day vs 1000s of raw records)
- **Reduced Computation**: Pre-calculated scores, no real-time aggregation needed
- **Cost Efficiency**: Fewer database reads for common operations
- **Standardization**: Normalized metrics across different device types

#### Understanding `wearables_data` Table

The **`metric_value` (JSONB)** field stores data exactly as the API provides:

```json
// Example for sleep metric from Oura
{
  "duration": 27480,
  "efficiency": 85,
  "rem_sleep": 5520,
  "deep_sleep": 7200,
  "light_sleep": 14760,
  "awake_time": 1920,
  "onset_latency": 540,
  "temperature_deviation": -0.2
}

// Example for heart_rate metric from Fitbit
{
  "bpm": 72,
  "confidence": "high",
  "context": "resting"
}
```

**Why JSONB?**
- Different devices send different structures (Oura's sleep data ≠ Fitbit's sleep data)
- APIs evolve - new fields can be added without migrations
- Query flexibility - PostgreSQL can query inside JSONB: `WHERE metric_value->>'bpm' > 100`
- No data loss - store everything now, decide what to use later

#### Real-World Data Flow Example

1. **3:00 AM**: Cron job triggers
2. **3:01 AM**: Fetches last 24h of data from Oura API
3. **3:02 AM**: Creates multiple `wearables_data` rows:
   - 1 row for sleep session
   - 1,440 rows for heart rate (one per minute)
   - 24 rows for hourly stress levels
   - 1 row for daily readiness score
4. **3:03 AM**: Aggregation job processes new raw data
5. **3:04 AM**: Updates `health_metrics_daily` with calculated daily summaries
6. **3:05 AM**: Dashboard cache refreshes with new data

This design follows the "write once, read many" pattern - optimizing for the most common use case (viewing dashboards) while maintaining complete data integrity

---------

INTEGRATION GUIDE:
🎯 Quick Integration

  React Native / Next.js Implementation

  // Call when health dashboard loads
  const aggregateHealthData = async () => {
    try {
      const response = await
  fetch(`${SUPABASE_URL}/functions/v1/health-aggregation`,
  {
        method: 'POST',
        headers: {
          'Authorization': `Bearer 
  ${supabase.auth.session()?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          days: 3  // Optional: defaults to 3 days for 
  real-time updates
        })
      });

      const result = await response.json();

      if (response.ok) {
        console.log(`✅ Aggregated ${result.days_processed}
   days in ${result.latency_ms}ms`);
        // Refresh your health dashboard data here
        refreshDashboard();
      }
    } catch (error) {
      console.error('Health aggregation failed:', error);
    }
  };

  📱 Integration Points

  1. Health Dashboard Screen Load

  useEffect(() => {
    // Trigger aggregation when user opens health screen
    aggregateHealthData();
  }, []);

  2. Pull-to-Refresh

  const onRefresh = async () => {
    setRefreshing(true);
    await aggregateHealthData();
    setRefreshing(false);
  };

-----------

## Dashboard Visualizations

### Sleep Analytics
- **Sleep Architecture Chart**: Stacked area showing REM, deep, light sleep phases
- **Weekly Sleep Trends**: Line graph of sleep duration and efficiency
- **Sleep Debt Tracker**: Running calculation showing accumulated deficit/surplus

### Activity & Movement
- **Daily Activity Rings**: Circular progress for steps, calories, active minutes
- **Weekly Activity Heatmap**: Calendar view showing intensity levels
- **Exercise Distribution**: Pie chart of activity types (cardio, strength, flexibility)

### Recovery & Readiness
- **HRV Trend Line**: 7/30/90 day moving averages with normal range bands
- **Recovery Score Gauge**: Speedometer-style display (0-100)
- **Readiness Factors**: Radar chart showing sleep, HRV, temperature, activity balance

### Cardiovascular Health
- **Resting Heart Rate Trends**: Line graph with weekly/monthly comparisons
- **Heart Rate Zones**: During workouts - time spent in each zone
- **Cardio Fitness Score**: VO2 max estimates over time

### Stress & Well-being
- **Stress Timeline**: Hour-by-hour stress levels throughout the day
- **Meditation/Mindfulness Minutes**: Bar chart tracking practice consistency
- **Mood Correlation Matrix**: Heatmap showing stress vs sleep, activity, etc.

### Comprehensive Views
- **Health Score Dashboard**: Combined metric showing overall wellness (0-100)
- **Weekly/Monthly Reports**: PDF-style summary with key insights
- **Goal Progress Trackers**: Multiple progress bars for various health goals
- **Comparative Analytics**: Your metrics vs age/gender benchmarks

### Advanced Analytics
- **Correlation Discovery**: Scatter plots showing relationships (sleep vs performance)
- **Predictive Insights**: "Based on your patterns, tomorrow's readiness will be..."
- **Anomaly Detection**: Highlighting unusual patterns requiring attention
- **Seasonal Trends**: Year-over-year comparisons for long-term users

## Implementation Notes

- **JSONB Storage**: The schema uses JSONB for `metric_value` to provide flexibility since different wearables provide varying data structures
- **Daily Aggregation**: The `health_metrics_daily` table provides fast access to common queries and dashboard rendering
- **Cron Job Updates**: Dashboard data updates via scheduled cron jobs pulling from each API endpoint based on user device configurations
- **Multi-Device Support**: Schema supports users with multiple wearable devices, combining data from various sources