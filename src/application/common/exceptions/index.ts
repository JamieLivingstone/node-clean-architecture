import { ValidationError } from 'yup';

export class NotFoundException extends Error {}
export class ValidationException extends ValidationError {}
