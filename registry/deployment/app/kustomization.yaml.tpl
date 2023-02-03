resources:
- overlays/${APP_DEPLOY_ENV}

images:
- name: "image"
  newName: "${APP_IMAGE_NAME}"
  newTag: "${APP_IMAGE_TAG}"

nameSuffix: "-${APP_NAME}"
namespace: "${APP_NAME}"
commonLabels:
    app.kubernetes.io/name: "${APP_NAME}"

patches:
- target:
    kind: Namespace
    name: app
  patch: |-
    - op: replace
      path: '/metadata/name'
      value: "${APP_NAME}"
- target:
    kind: Deployment
    name: app
  patch: |-
    - op: add
      path: '/spec/template/metadata/labels/run-id'
      value: "${APP_CI_RUN_ID}"
- target:
    kind: Ingress
    name: app-v2
  patch: |-
    - op: add
      path: '/metadata/annotations/kubernetes.io~1ingress.class'
      value: "${APP_NAME}-v2"
