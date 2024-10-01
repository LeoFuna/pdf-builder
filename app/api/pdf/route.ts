import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function GET(request: NextRequest) {
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);   
    const page = pdfDoc.addPage([80, 52]);
    const { width, height } = page.getSize();

    const fontSize = 6;
    // const fontSizeLabel = 4
    const productName = 'TAMPA 28MM 1881 27K AZUL ESCURO';

    const productNameObject = productName.split(' ').reduce((acc, curr) => {
        if (acc.firstLine.length < 19) {
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

    const yFistLine = productName.length > 22 ? 7 : 10
    // max length 22
    page.drawText(productNameObject.firstLine, {
        x: 5,
        y: height - yFistLine,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
    });
    if (productNameObject.secondLine.length) {
        page.drawText(productNameObject.secondLine, {
            x: 5,
            y: height - 13,
            size: fontSize,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
        });
    }
    page.drawText('9nfp2imucu1pcpo0', {
        x: 5,
        y: height - 19,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
    });
    page.drawLine({
        start: { x: 3, y: height - 22 },
        end: { x: width - 3, y: height - 22 },
        thickness: 0.5,
        color: rgb(0, 0, 0),
    })

    page.drawText('LOTE: 9nfp2imucu1pcpo0', {
        x: 5,
        y: height - 29,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
    });
    page.drawText('VLM: 923nuv39v8pc98c9mp', {
        x: 5,
        y: height - 36,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
    });
    page.drawText('QTD: 2 MIL', {
        x: 5,
        y: height - 43,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
    });
    

    const pdfBytes = await pdfDoc.save();
    
    return NextResponse.json({ base64Url: `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`, base64: Buffer.from(pdfBytes).toString('base64') }, { status: 200 });
}
