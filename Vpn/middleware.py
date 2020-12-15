from django.utils.cache import add_never_cache_headers
from Vpn.settings import SECRET_KEY

class NoCachingMiddleware(object):
    def process_response(self, request, response):
        # add_never_cache_headers(response)
        # print("cleaning cash")
        #print(SECRET_KEY)
        return response