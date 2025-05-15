from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.views.decorators.cache import never_cache


@require_GET
@never_cache
def health_check(request):
    """
    Simple health check endpoint for checking connectivity.
    This endpoint is used by the frontend to verify if the backend is reachable.
    """
    return JsonResponse({
        'status': 'ok',
        'timestamp': request.GET.get('_', ''),
    })
