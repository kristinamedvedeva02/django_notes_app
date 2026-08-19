from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return None

    original_data = response.data

    error_codes = {
        400: 'validation_error',
        401: 'authentication_required',
        403: 'permission_denied',
        404: 'not_found',
        405: 'method_not_allowed',
    }

    status_code = response.status_code

    if isinstance(original_data, dict) and 'detail' in original_data:
        message = str(original_data['detail'])
    else:
        message = 'Invalid request data.'

    response.data = {
        'error': {
            'code': error_codes.get(
                status_code,
                'api_error'
            ),
            'message': message,
            'details': original_data,
        }
    }

    return response