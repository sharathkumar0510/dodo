import json
from django.conf import settings
from pywebpush import webpush, WebPushException

from .models import PushSubscription


def send_web_push(user, title, message, url=None, icon=None, badge=None, image=None, tag=None, actions=None):
    """
    Send a web push notification to a user.
    
    Args:
        user: The user to send the notification to
        title: The title of the notification
        message: The message body of the notification
        url: The URL to open when the notification is clicked
        icon: The URL of the icon to display
        badge: The URL of the badge to display
        image: The URL of the image to display
        tag: A tag to group notifications
        actions: A list of actions the user can take
    
    Returns:
        dict: A dictionary with the status of each subscription
    """
    if not settings.WEBPUSH_SETTINGS.get('VAPID_PRIVATE_KEY'):
        return {'status': 'error', 'message': 'VAPID keys not configured'}
    
    subscriptions = PushSubscription.objects.filter(user=user)
    if not subscriptions.exists():
        return {'status': 'error', 'message': 'No subscriptions found for user'}
    
    payload = {
        'title': title,
        'body': message,
    }
    
    if url:
        payload['url'] = url
    if icon:
        payload['icon'] = icon
    if badge:
        payload['badge'] = badge
    if image:
        payload['image'] = image
    if tag:
        payload['tag'] = tag
    if actions:
        payload['actions'] = actions
    
    results = []
    
    for subscription in subscriptions:
        subscription_info = {
            'endpoint': subscription.endpoint,
            'keys': {
                'p256dh': subscription.p256dh,
                'auth': subscription.auth
            }
        }
        
        try:
            webpush(
                subscription_info=subscription_info,
                data=json.dumps(payload),
                vapid_private_key=settings.WEBPUSH_SETTINGS.get('VAPID_PRIVATE_KEY'),
                vapid_claims={
                    'sub': f"mailto:{settings.WEBPUSH_SETTINGS.get('VAPID_ADMIN_EMAIL')}"
                }
            )
            results.append({
                'subscription_id': subscription.id,
                'status': 'success'
            })
        except WebPushException as e:
            # If the subscription is expired or invalid, delete it
            if e.response and e.response.status_code in [404, 410]:
                subscription.delete()
            
            results.append({
                'subscription_id': subscription.id,
                'status': 'error',
                'message': str(e)
            })
    
    return {
        'status': 'success',
        'results': results
    }


def process_offline_actions(user):
    """
    Process all pending offline actions for a user.
    
    Args:
        user: The user whose offline actions to process
    
    Returns:
        dict: A dictionary with the status of the processing
    """
    from .models import OfflineAction
    from django.utils import timezone
    
    actions = OfflineAction.objects.filter(user=user, synced=False)
    
    results = []
    
    for action in actions:
        try:
            # Here you would implement the logic to process each action type
            # For example, if action.action_type == 'create' and action.resource_type == 'booking'
            # you would create a new booking using action.data
            
            # For now, we'll just mark them as synced
            action.synced = True
            action.synced_at = timezone.now()
            action.save()
            
            results.append({
                'action_id': action.id,
                'status': 'success'
            })
        except Exception as e:
            results.append({
                'action_id': action.id,
                'status': 'error',
                'message': str(e)
            })
    
    return {
        'status': 'success',
        'processed_count': len(results),
        'results': results
    }
