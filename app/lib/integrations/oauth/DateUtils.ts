/**
 * Date utility functions for OAuth token expiration handling
 * Provides safe date calculations with bounds checking to prevent "Date value out of bounds" errors
 */

// Maximum expiration time: 10 years from now (in seconds)
const MAX_EXPIRES_IN_SECONDS = 10 * 365 * 24 * 60 * 60; // 10 years

// Minimum expiration time: 1 minute from now (in seconds)
const MIN_EXPIRES_IN_SECONDS = 60; // 1 minute

// Default expiration time if no valid expires_in provided: 1 hour (in seconds)
const DEFAULT_EXPIRES_IN_SECONDS = 3600; // 1 hour

/**
 * Validates and normalizes an expires_in value
 * @param expiresIn The expires_in value from OAuth response
 * @returns A validated expires_in value in seconds, or default if invalid
 */
export function validateExpiresIn(expiresIn: any): number {
  // Handle undefined, null, or non-numeric values
  if (expiresIn == null || typeof expiresIn !== 'number' || isNaN(expiresIn)) {
    console.warn('Invalid expires_in value, using default:', expiresIn);
    return DEFAULT_EXPIRES_IN_SECONDS;
  }

  // Handle negative values
  if (expiresIn < 0) {
    console.warn('Negative expires_in value, using default:', expiresIn);
    return DEFAULT_EXPIRES_IN_SECONDS;
  }

  // Handle extremely small values (less than 1 minute)
  if (expiresIn < MIN_EXPIRES_IN_SECONDS) {
    console.warn('expires_in too small, using minimum:', expiresIn);
    return MIN_EXPIRES_IN_SECONDS;
  }

  // Handle extremely large values (more than 10 years)
  if (expiresIn > MAX_EXPIRES_IN_SECONDS) {
    console.warn('expires_in too large, using maximum:', expiresIn);
    return MAX_EXPIRES_IN_SECONDS;
  }

  return Math.floor(expiresIn); // Ensure integer value
}

/**
 * Safely calculates expiration date from expires_in seconds
 * @param expiresIn The expires_in value in seconds
 * @returns A valid Date object or null if calculation would be invalid
 */
export function calculateExpirationDate(expiresIn: any): Date {
  const validExpiresIn = validateExpiresIn(expiresIn);
  const now = Date.now();
  const expirationTime = now + (validExpiresIn * 1000);

  // Additional safety check for the calculated date
  if (expirationTime < now || expirationTime > Date.now() + (MAX_EXPIRES_IN_SECONDS * 1000)) {
    console.warn('Calculated expiration time out of bounds, using default');
    return new Date(now + (DEFAULT_EXPIRES_IN_SECONDS * 1000));
  }

  return new Date(expirationTime);
}

/**
 * Safely converts a date to ISO string with validation
 * @param date The date to convert
 * @returns ISO string or current time + default expiration if invalid
 */
export function safeToISOString(date: any): string {
  try {
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toISOString();
    }
  } catch (error) {
    console.warn('Invalid date for ISO conversion:', date, error);
  }

  // Fallback to default expiration
  const fallbackDate = new Date(Date.now() + (DEFAULT_EXPIRES_IN_SECONDS * 1000));
  return fallbackDate.toISOString();
}

/**
 * Safely parses a date string with validation
 * @param dateStr The date string to parse
 * @returns A valid Date object or null if parsing fails
 */
export function safeParseDateString(dateStr: any): Date | null {
  if (typeof dateStr !== 'string') {
    return null;
  }

  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date;
    }
  } catch (error) {
    console.warn('Error parsing date string:', dateStr, error);
  }

  return null;
}

/**
 * Creates expiration timestamp (milliseconds) from expires_in seconds
 * @param expiresIn The expires_in value in seconds
 * @returns Timestamp in milliseconds
 */
export function calculateExpirationTimestamp(expiresIn: any): number {
  const validExpiresIn = validateExpiresIn(expiresIn);
  return Date.now() + (validExpiresIn * 1000);
}

/**
 * Checks if a date/timestamp is within valid bounds
 * @param date Date object, timestamp, or date string
 * @returns true if the date is valid and within reasonable bounds
 */
export function isValidDate(date: any): boolean {
  let timestamp: number;

  if (date instanceof Date) {
    timestamp = date.getTime();
  } else if (typeof date === 'number') {
    timestamp = date;
  } else if (typeof date === 'string') {
    const parsed = safeParseDateString(date);
    if (!parsed) return false;
    timestamp = parsed.getTime();
  } else {
    return false;
  }

  if (isNaN(timestamp)) {
    return false;
  }

  const now = Date.now();
  const maxFuture = now + (MAX_EXPIRES_IN_SECONDS * 1000);
  const minPast = now - (365 * 24 * 60 * 60 * 1000); // 1 year ago

  return timestamp >= minPast && timestamp <= maxFuture;
}