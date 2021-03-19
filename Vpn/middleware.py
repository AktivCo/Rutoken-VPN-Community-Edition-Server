"""
Middleware methods
"""

class NoCachingMiddleware(object):
    def process_response(self, request, response): # pylint: disable=unused-argument
        # add_never_cache_headers(response)
        # print("cleaning cash")
        #print(SECRET_KEY)
        return response
