import { Request, Response } from 'express';
import { identifyContactService } from '../services/identifyContactService';

export const identifyContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, phoneNumber } = req.body;

    // Validate input
    if (!email && !phoneNumber) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Either email or phoneNumber must be provided'
        }
      });
      return;
    }

    // Call the service to identify and link contacts
    const result = await identifyContactService({ email, phoneNumber });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in identifyContact:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error during contact identification';
    
    res.status(500).json({
      success: false,
      error: {
        message: errorMessage
      }
    });
  }
}; 