type LogMethod = {
  (message: { [key: string]: unknown }): void;
};

export interface ILogger {
  alert: LogMethod;
  crit: LogMethod;
  debug: LogMethod;
  emerg: LogMethod;
  error: LogMethod;
  info: LogMethod;
  notice: LogMethod;
  warning: LogMethod;
}
