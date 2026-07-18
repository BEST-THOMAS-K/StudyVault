from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Django admin
    path('admin/', admin.site.urls),

    # Your apps
    path('api/users/', include('users.urls')),
    path('api/notes/', include('notes.urls')),
    # If you have a 'pysq' or 'pyqs' app, uncomment the line below after fixing the folder name
    # path('api/pyqs/', include('pyqs.urls')),

    # AI assistant - this is the one we need
    path('api/ai/', include('ai.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)