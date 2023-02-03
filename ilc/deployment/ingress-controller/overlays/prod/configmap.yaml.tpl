---
kind: ConfigMap
apiVersion: v1
metadata:
  name: nginx-configuration
data:
  use-gzip: 'true'
  location-snippet: |
    if (${TOKEN} = "") {
      add_header  X-Robots-Tag "noindex, nofollow";
    }
    add_header  Link '<https://fonts.gstatic.com/>; rel="preconnect"; crossorigin, <https://fonts.gstatic.com/>; rel="dns-prefetch", <https://fonts.googleapis.com/>; rel="preconnect"; crossorigin, <https://fonts.googleapis.com/>; rel="dns-prefetch", <https://gateway.jerkmate.com/>; rel="preconnect"; crossorigin, <https://gateway.jerkmate.com/>; rel="dns-prefetch"';
    add_header  X-Region ${REGION};

