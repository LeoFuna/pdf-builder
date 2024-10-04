import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function POST(req: NextRequest) {
    const { productName, productId, batchId, vlmId, quantity } = await req.json();
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);   
    const page = pdfDoc.addPage([80, 52]);
    const { width, height } = page.getSize();

    const fontSize = 4;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productNameObject = productName.split(' ').reduce((acc: any, curr: any) => {
        if (acc.firstLine.length < 24) {
            if (!acc.firstLine.length) {
                acc.firstLine = curr;
            } else {
                acc.firstLine = acc.firstLine + ' ' + curr;
            }
        } else {
            if (!acc.secondLine.length) {
                acc.secondLine = curr;
            } else {
                acc.secondLine = acc.secondLine + ' ' + curr;
            }
        }
        return acc;
    }, { firstLine: '', secondLine: '' });

    const yFistLine = productName.length > 24 ? 7 : 10

    page.drawText(productNameObject.firstLine, {
        x: 10,
        y: height - yFistLine,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
    });
    if (productNameObject.secondLine.length) {
        page.drawText(productNameObject.secondLine, {
            x: 10,
            y: height - 13,
            size: fontSize,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
        });
    }
    page.drawText(productId, {
        x: 10,
        y: height - 19,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
    });
    page.drawLine({
        start: { x: 7, y: height - 22 },
        end: { x: width + 3, y: height - 22 },
        thickness: 0.5,
        color: rgb(0, 0, 0),
    })

    page.drawText(`LOTE: ${batchId}`, {
        x: 10,
        y: height - 29,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
    });
    page.drawText(`VLM: ${vlmId}`, {
        x: 10,
        y: height - 36,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
    });
    page.drawText(`QTD: ${quantity} MIL`, {
        x: 10,
        y: height - 43,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
    });
    

    const pdfBytes = await pdfDoc.save();
    
    return NextResponse.json(Buffer.from(pdfBytes).toString('base64'), { status: 200 });
}
