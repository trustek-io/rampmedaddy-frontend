import React from 'react'

const OnramperWidget: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe
        src="https://buy.onramper.com?apiKey=pk_prod_01J3CZHG87RNJV6K88PJ5G2VJK&themeName=dark&mode=buy&defaultFiat=USD"
        title="Onramper Widget"
        style={{ width: '100%', height: '100%', border: 'none' }}
        allow="accelerometer; autoplay; camera; gyroscope; payment; microphone"
      ></iframe>
    </div>
  )
}

export default OnramperWidget
