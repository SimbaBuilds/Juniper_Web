export const SERVICES = [
  'Notion',
  'Slack', 
  'Dropbox',
  'Todoist',
  'Perplexity',
  'Google Sheets',
  'Google Docs',
  'Gmail',
  'Google Calendar',
  'Microsoft Excel Online',
  'Microsoft Word Online',
  'Microsoft Calendar',
  'Microsoft Email',
  'Microsoft Teams',
  'Textbelt',
  'Twilio',
  'Google Meet',
  'Twitter/X'
] as const;

export const SERVICE_CATEGORIES = {
  'Communications': ['Slack', 'Microsoft Teams', 'Twilio', 'Textbelt'],
  'Productivity and Task Management': ['Notion', 'Todoist'],
  'Calendar': ['Google Calendar', 'Microsoft Calendar'],
  'Email': ['Gmail', 'Microsoft Email'],
  'Video Conferencing': ['Google Meet'],
  'Research': ['Perplexity', 'Twitter/X'],
  'Cloud Storage': ['Dropbox'],
  'Cloud Text Documents': ['Google Docs', 'Microsoft Word Online'],
  'Cloud Spreadsheets': ['Google Sheets', 'Microsoft Excel Online']
} as const;

export type ServiceName = typeof SERVICES[number];
export type ServiceCategory = keyof typeof SERVICE_CATEGORIES;

export interface IntegrationStatus {
  name: ServiceName;
  status: 'connected' | 'pending_setup' | 'disconnected';
  lastConnected?: string;
  category: ServiceCategory;
  description: string;
  isSystemIntegration?: boolean;
}