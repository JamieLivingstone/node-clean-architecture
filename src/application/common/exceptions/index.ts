import { ValidationError } from 'yup';

export class BadRequestException extends Error {}
export class InternalServerException extends Error {}
export class NotFoundException extends Error {}
export class ValidationException extends ValidationError {}
