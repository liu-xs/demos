import React, { useState, useRef, useEffect } from 'react';
import fetch from './fetch'
// import pdfjsLib from 'pdfjs-dist/webpack'
import pdfjs from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PdfViewer = () => {
  // const [pageRenders, setpageRenders] = useState([])
  const [pdfDoc, setpdfDoc] = useState(null)
  // const [numPages, setnumPages] = useState(0)
  const pageRenderRef = useRef()


  useEffect(() => {
    init()
  }, [])
  useEffect(()=>{
    renderPage()
  },[pdfDoc])
  const init = async () => {
    // 解决pdfjs历史遗留跨域问题
    const pdfparam = {
      url: './demo.pdf', withCredentials: true
    };
    const pdf = await pdfjs.getDocument(pdfparam)
    setpdfDoc(pdf)
    // setnumPages(pdf.numPages)
    renderPage(pdf.numPages > 0 ? 1 : 0)
  }
  const renderPage = async (num=1) => {
    if(!pdfDoc)return false;
    const pdf = pdfDoc
    const { _pdfInfo: { numPages } } = pdf
    if (num < 1 || num > numPages) return false;
    // for (let _page = 1; _page <= numPages; _page++) {

    // }
    pdf.getPage(num).then(async (page) => {
      const viewport = page.getViewport({ scale: 1.5 })
      const height = viewport.height
      const width = viewport.width
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) {
        console.error('不支持canvas')
        return false;
      }
      canvas.height = height
      canvas.width = width

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        enableWebGL: true,
      }
      const renderTask = page.render(renderContext)
      renderTask.promise.then(() => {
        if (num === 1) {
          mosaicFirstPage(context)
        }
        drawWaterMark(context, width, height)
        pageRenderRef.current.appendChild(canvas)
        pageRenderRef.current.appendChild(document.createElement('hr'))
        renderPage(++num)
      })


    });
  }
  const drawWaterMark = (
    ctx,
    width,
    height,
    text = 'demo',
    rotate = -45,
    color = 'rgba(204, 205, 207, 0.5)',
    gap = 50,

  ) => {
    ctx.font = `25px '微软雅黑'`
    ctx.fillStyle = color;
    let horizontalWidth = ctx.measureText(text).width + 50

    const draw = (x, y) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-rotate / 180 * Math.PI);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }

    for (let i = 0; i < width; i += horizontalWidth + gap) {
      for (let j = 0; j < height; j += horizontalWidth + gap) {
        draw(i, j)
      }
    }

  }
  /*
   @context:画布上下文；
   @ox:起始点x坐标；
   @oy：起始点y坐标；
   @width：马赛克宽度；
   @height:马赛克高度
   @size:模糊距离
 */
  const createMosaic = ({
    context, ox = 0, oy = 0, width = 10, height = 10, size = 5
  }) => {
    if (!context) return false;
    const data = context.getImageData(ox, oy, width, height)
    for (let x = 0; x < (width); x += size) {
      for (let y = 0; y < (height); y += size) {
        let cR = data.data[(y * width + x) * 4],
          cG = data.data[(y * width + x) * 4 + 1],
          cB = data.data[(y * width + x) * 4 + 2];
        context.fillStyle = `rgb(${cR},${cG},${cB})`;
        context.fillRect(ox + x, oy + y, x + size, y + size);
      }
    }
  };
  const mosaicFirstPage = (context) => {
    if (!context) return false;
    const mosList = [
      { x: 342, y: 565, width: 150, height: 12, size: 3 },
      { x: 342, y: 605, width: 150, height: 11, size: 3 },
      { x: 342, y: 753, width: 100, height: 11, size: 3 },
      { x: 342, y: 785, width: 100, height: 11, size: 3 },
      { x: 342, y: 820, width: 100, height: 13, size: 3 },
    ]
    mosList.forEach(v => {
      createMosaic({
        context,
        ox: v.x,
        oy: v.y,
        width: v.width,
        height: v.height,
        size: v.size
      })
    })


  };
  return (
    <div>
      <div style={{ margin: '0 auto', width: '900px' }} ref={pageRenderRef}>

      </div>
    </div>
  );
}



export default PdfViewer;
