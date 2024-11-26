import fetch from 'cross-fetch';

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1310646072334356572/TcpaUFsrl27tPJFqkjJFabKlAOn6Nn-igt6pKaZ2n3io8bE1__5G8QXOV9u-fmy4IP01';

export const sendToDiscord = async (names: Array<{
  rank: number;
  name: string;
  votes: number;
  trend: string;
}>) => {
  const topNames = names.slice(0, 10);
  
  const fields = topNames.map(name => ({
    name: `#${name.rank} ${name.trend === 'hot' ? '🔥' : name.trend === 'new' ? '✨' : ''}`,
    value: `**${name.name}** - ${name.votes} votes`,
    inline: true
  }));

  const embed = {
    title: '🤖 AI Bot Name Contest Leaderboard',
    color: 0x6366f1, // Indigo color
    fields,
    timestamp: new Date().toISOString(),
    footer: {
      text: 'Updated'
    }
  };

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send to Discord');
    }

    return true;
  } catch (error) {
    console.error('Error sending to Discord:', error);
    throw error;
  }
};