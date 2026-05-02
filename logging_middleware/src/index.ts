export type Stack = "backend" | "frontend";
export type Level = "debug" | "info" | "warn" | "error" | "fatal";

export type FrontendPackage = "api" | "component" | "hook" | "page" | "state" | "style";
export type BackendPackage = "cache" | "controller" | "cron_job" | "db" | "domain" | "handler" | "repository" | "route" | "service";
export type SharedPackage = "auth" | "config" | "middleware" | "utils";

export type Package = FrontendPackage | BackendPackage | SharedPackage;

export interface LogEntry {
  stack: Stack;
  level: Level;
  package: Package;
  message: string;
}

export interface LoggerConfig {
  url?: string;
  token?: string; // Add your token if the route is protected by bearer
}

let config: LoggerConfig = {
  url: "http://20.207.122.201/evaluation-service/logs",
};

/**
 * Initializes the logger with an optional configuration.
 * Call this once at the start of your application.
 *
 * @param newConfig Partial configuration overrides.
 */
export const initLogger = (newConfig: Partial<LoggerConfig>) => {
  config = { ...config, ...newConfig };
};

/**
 * Sends a log entry to the Affordmed Test Server.
 * 
 * @param stack The stack layer (backend or frontend).
 * @param level The severity level of the log.
 * @param pkg The package or component that triggered the log.
 * @param message The descriptive message of the event.
 */
export const Log = async (stack: Stack, level: Level, pkg: Package, message: string) => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (config.token) {
      headers["Authorization"] = `Bearer ${config.token}`;
    }

    const response = await fetch(config.url!, {
      method: "POST",
      headers,
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message,
      }),
    });

    if (!response.ok) {
      console.error(`[Logging Middleware] Failed to send log. Status: ${response.status}`);
      try {
        console.error(await response.text());
      } catch (e) {
        // text parsing failed
      }
    }
  } catch (error) {
    console.error("[Logging Middleware] Network error while sending log:", error);
  }
};
