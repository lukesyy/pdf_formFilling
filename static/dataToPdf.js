/*
 * @Date: 2022-04-26 19:52:38
 * @LastEditors: Lukesy
 * @LastEditTime: 2022-04-27 13:49:14
 */

function dataToPdf(pdfUrl, fields) {
	var xhr = new XMLHttpRequest()
	xhr.open('GET', pdfUrl, true)
	xhr.responseType = 'arraybuffer'
	xhr.onload = function () {
		if (this.status == 200) {
			let buf = this.response
			let filled_pdf = pdfform().transform(buf, fields)
			var blob = ''
			try {
				blob = new Blob([filled_pdf], { type: 'application/pdf' })
			} catch (e) {
				var bb = new BlobBuilder()
				bb.append([filled_pdf])
				blob = bb.getBlob('application/pdf')
			}
			var fileURL = URL.createObjectURL(blob)
			// window.open(fileURL)
			var a = document.createElement('a')
			a.setAttribute('href', fileURL)
			a.setAttribute('target', '_blank')
			let clickEvent = document.createEvent('MouseEvents')
			clickEvent.initEvent('click', true, true)
			a.dispatchEvent(clickEvent)
		} else {
			console.error('failed to load URL (code: ' + this.status + ')')
		}
	}
	xhr.send()
}

function imgWatermark(imgUrl, textList) {
	let body = document.getElementsByTagName('body')[0]
	var img = new Image()
	img.src = imgUrl
	img.onload = async function (e) {
		let canvas = imgToCanvas(img)
		watermark(canvas, textList)
		let newImage = await canvasToImg(canvas)
		body.appendChild(newImage)
	}

	function canvasToImg(canvas) {
		let image = new Image()
		image.setAttribute('crossOrigin', 'Anonymous')
		return new Promise(resolve => {
			image.src = canvas.toDataURL('image/jpg')
			image.addEventListener('load', () => resolve(image))
		})
	}

	function imgToCanvas(img) {
		let canvas = document.createElement('canvas')
		canvas.width = img.width
		canvas.height = img.height
		let ctx = canvas.getContext('2d')
		ctx.drawImage(img, 0, 0)
		return canvas
	}

	function watermark(canvas, textList) {
		let ctx = canvas.getContext('2d')
		// 设置填充字号和字体，样式
		ctx.font = '34px 黑体'
		ctx.fillStyle = '#FF0000'
		// 设置右对齐
		// ctx.textAlign = 'right'
		// 在指定位置绘制文字
		textList.forEach(item => {
			ctx.fillText(item.name, item.w, item.height)
		})
	}
}
