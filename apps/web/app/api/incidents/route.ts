import { NextRequest, NextResponse } from 'next/server';
import { validateIncidentReport } from '@/lib/validations/incident-report';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateIncidentReport(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const incidentData = validation.data;

    return NextResponse.json(
      {
        success: true,
        message: 'Incident report submitted successfully',
        data: { id: 'incident-' + Date.now(), ...incidentData },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON format' },
        { status: 400 }
      );
    }

    console.error('Incident submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
