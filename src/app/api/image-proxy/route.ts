
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('URL de imagen no proporcionada', { status: 400 });
  }

  try {
    // El servidor descarga la imagen, evitando problemas de CORS en el cliente.
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Error al obtener la imagen: ${response.statusText}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const dataUri = `data:${contentType};base64,${base64Image}`;
    
    // Devuelve la imagen como un Data URI en la respuesta.
    return new NextResponse(dataUri, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error en el proxy de imagen:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return new NextResponse(errorMessage, { status: 500 });
  }
}
