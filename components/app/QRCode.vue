<script lang="ts">
import qrcode from 'tc-qrcode'

import type { IEncodeOption } from 'tc-qrcode/type'

export default {
  props: {
    options: {
      type: Object as () => IEncodeOption,
      default: () => ({
        text: 'https://mou.best',
        size: 256,
        typeNumber: 2,
        foreground: '#000000',
        background: '#ffffff',
        correctLevel: '2',
        pdground: '#000000',
        image: undefined,
        imageSize: undefined,
      }),
    },
  },
  setup(props) {
    return () =>
      h('img', {
        src: qrcode.encodeAsBase64(props.options),
        alt: 'QR Code',
      })
  },
}
</script>
