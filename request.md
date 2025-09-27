  timeRange: 'max',
  isNormalized: false
}
❌ Wellness export error: RangeError: Invalid time value
    at Date1.toISOString (<anonymous>)
    at WellnessExportService.addChartSection (app/lib/services/WellnessExportService.ts:445:29)
    at WellnessExportService.addTrendChartsSection (app/lib/services/WellnessExportService.ts:419:23)
    at WellnessExportService.generateExport (app/lib/services/WellnessExportService.ts:250:23)
    at async POST (app/api/wellness/export/route.ts:93:22)
  443 |     console.log(`📈 Chart section for "${chart.name}":`, {
  444 |       timeRangeDays: days,
> 445 |       cutoffDate: cutoffDate.toISOString(),
      |                             ^
  446 |       totalHealthData: healthData.length,
  447 |       filteredDataLength: filteredData.length,
  448 |       selectedMetrics: chart.selectedMetrics,
 POST /api/wellness/export 500 in 563ms
