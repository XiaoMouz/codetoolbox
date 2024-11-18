<script lang="ts">
import qrcode from 'tc-qrcode'

import type { IEncodeOption } from 'tc-qrcode/type'

export default {
  props: {
    content: {
      type: String,
      required: true,
    },
    options: {
      type: Object as () => IEncodeOption,
      default: () => ({
        size: 256,
        typeNumber: 4,
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
    props.options.text = props.content
    return () =>
      h('img', {
        src: qrcode.encodeAsBase64(props.options),
        alt: 'QR Code',
      })
  },
}
</script>
