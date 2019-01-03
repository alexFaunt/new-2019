import { createLogger, format, transports } from 'winston';

const messageFormat = format.printf(({ timestamp, label, level, message }) => (
  `${timestamp} [${label}] ${level}: ${message}`
));

// Pretty print information from known error types
const extendedErrorFormat = format((info) => {
  const { name, message, event, context, originalError, stack, ...rest } = info;

  const originalErrorString = originalError
    ? `originalError: ${JSON.stringify(originalError.message)} ${JSON.stringify(originalError.stack)}`
    : null;

  const combined = [
    name,
    message,
    context ? `context: ${JSON.stringify(context)}` : null,
    originalErrorString,
  ].filter((line) => line);

  return {
    ...rest,
    message: stack ? `${combined.join(', ')}\n${stack}` : combined.join(', '),
  };
});

export default (label) => createLogger({
  format: format.combine(
    format.label({ label }),
    format.timestamp(),
    extendedErrorFormat(),
    messageFormat,
  ),
  transports: [new transports.Console()],
});
