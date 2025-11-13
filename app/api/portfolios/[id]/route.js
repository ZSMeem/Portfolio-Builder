import { authenticate } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const portfolios = await query(
      `SELECT p.*, u.name as user_name, u.email as user_email
       FROM portfolios p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ? AND p.is_published = TRUE`,
      [id]
    );

    if (portfolios.length === 0) {
      return Response.json(
        { message: 'Portfolio not found' },
        { status: 404 }
      );
    }

    const portfolio = portfolios[0];
    const parsedPortfolio = {
      ...portfolio,
      personal_info: portfolio.personal_info ? JSON.parse(portfolio.personal_info) : null,
      social_links: portfolio.social_links ? JSON.parse(portfolio.social_links) : null,
      skills: portfolio.skills ? JSON.parse(portfolio.skills) : [],
    };

    return Response.json(parsedPortfolio);
  } catch (error) {
    console.error('Get portfolio error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const user = await authenticate(request);

  if (!user) {
    return Response.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id } = params;
    const body = await request.json();

    // Verify portfolio belongs to user
    const userPortfolios = await query(
      'SELECT id FROM portfolios WHERE id = ? AND user_id = ?',
      [id, user.id]
    );

    if (userPortfolios.length === 0) {
      return Response.json(
        { message: 'Portfolio not found' },
        { status: 404 }
      );
    }

    const updateFields = [];
    const updateValues = [];

    Object.keys(body).forEach(key => {
      if (['personal_info', 'social_links', 'skills'].includes(key)) {
        updateFields.push(`${key} = ?`);
        updateValues.push(JSON.stringify(body[key]));
      } else {
        updateFields.push(`${key} = ?`);
        updateValues.push(body[key]);
      }
    });

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id, user.id);

    await query(
      `UPDATE portfolios SET ${updateFields.join(', ')} 
       WHERE id = ? AND user_id = ?`,
      updateValues
    );

    const [updatedPortfolio] = await query(
      'SELECT * FROM portfolios WHERE id = ?',
      [id]
    );

    const parsedPortfolio = {
      ...updatedPortfolio,
      personal_info: updatedPortfolio.personal_info ? JSON.parse(updatedPortfolio.personal_info) : null,
      social_links: updatedPortfolio.social_links ? JSON.parse(updatedPortfolio.social_links) : null,
      skills: updatedPortfolio.skills ? JSON.parse(updatedPortfolio.skills) : [],
    };

    return Response.json(parsedPortfolio);
  } catch (error) {
    console.error('Update portfolio error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}