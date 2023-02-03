---
kind: ConfigMap
apiVersion: v1
metadata:
  name: nginx-configuration
data:
  use-gzip: 'true'
  location-snippet: |
    location ~ robots.txt {
      add_header  Content-Type  text/plain;
      return 200 "User-agent: Elastic-Crawler\nAllow: /\n\nUser-agent: *\nDisallow: /\n";
    }
    add_header  X-Robots-Tag "noindex, nofollow";
    add_header  Link '<https://fonts.gstatic.com/>; rel="preconnect"; crossorigin, <https://fonts.gstatic.com/>; rel="dns-prefetch", <https://fonts.googleapis.com/>; rel="preconnect"; crossorigin, <https://fonts.googleapis.com/>; rel="dns-prefetch", <https://gateway.staging.jerkmate.com/>; rel="preconnect"; crossorigin, <https://gateway.staging.jerkmate.com/>; rel="dns-prefetch", <https://cdncl-staging.jerkmate.com/>; rel="preconnect"; crossorigin, <https://cdncl-staging.jerkmate.com/>; rel="dns-prefetch"';
    add_header  X-Region ${REGION};
