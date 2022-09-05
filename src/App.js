import React, { useState } from 'react'
import { ConnectButton, Modal } from 'web3uikit'
import Coin from './components/Coin'
import './App.css'
import logo from './images/Moralis.png'
import { abouts } from './about'
import { useMoralisWeb3Api, useMoralis } from 'react-moralis'
import { useEffect } from 'react'

const App = () => {
  const [btc, setBtc] = useState(50)
  const [eth, setEth] = useState(27)
  const [link, setLink] = useState(80)
  const [modalPrice, setModalPrice] = useState('~')
  const [visible, setVisible] = useState(false)
  const [modalToken, setModalToken] = useState(false)
  const Web3Api = useMoralisWeb3Api()
  const { Moralis, isInitialized } = useMoralis()

  useEffect(() => {
    async function fetchTokenPrice() {
      const options = {
        address: abouts.find((x) => x.token === modalToken).address,
      }
      const price = await Web3Api.token.getTokenPrice(options)
      setModalPrice(price.usdPrice.toFixed(2))
    }
    if (modalToken) {
      fetchTokenPrice()
    }
  }, [modalToken, Web3Api])

  useEffect(() => {
    async function getRatio(tick, setPercentage) {
      const Votes = Moralis.Object.extend('Votes')
      const query = new Moralis.Query(Votes)
      query.equalTo('ticker', tick)
      query.descending('createdAt')
      const results = await query.first()
      let up = Number(results.attributes.up)
      let down = Number(results.attributes.down)
      let ratio = Math.round((up / (up + down)) * 100)
      setPercentage(ratio)
    }

    async function getLiveQuery() {
      let query = new Moralis.Query('Votes')
      let subscription = await query.subscribe()

      subscription.on('update', (object) => {
        if (object.attributes.ticker === 'LINK') {
          getRatio('LINK', setLink)
        }

        if (object.attributes.ticker === 'BTC') {
          getRatio('BTC', setBtc)
        }

        if (object.attributes.ticker === 'ETH') {
          getRatio('ETH', setEth)
        }
      })
    }

    if (isInitialized) {
      getRatio('BTC', setBtc)
      getRatio('ETH', setEth)
      getRatio('LINK', setLink)

      getLiveQuery()
    }
  }, [isInitialized, Moralis.Object, Moralis.Query])

  return (
    <>
      <div className="header">
        <div className="logo">
          <img src={logo} alt="logo" height="50px" />
          Sentiment
        </div>
        <ConnectButton />
      </div>
      <div className="instructions">
        Where do you think these tokens are going? Up or Down?
      </div>
      <div className="list">
        <Coin
          percentage={btc}
          setPercentage={setBtc}
          token="BTC"
          setModalToken={setModalToken}
          setVisible={setVisible}
        />
        <Coin
          percentage={eth}
          setPercentage={setEth}
          token="ETH"
          setModalToken={setModalToken}
          setVisible={setVisible}
        />
        <Coin
          percentage={link}
          setPercentage={setLink}
          token="LINK"
          setModalToken={setModalToken}
          setVisible={setVisible}
        />
      </div>
      <Modal
        isVisible={visible}
        onCloseButtonPressed={() => {
          setModalPrice('~')
          setVisible(false)
        }}
        hasFooter={false}
        title={modalToken ? modalToken : undefined}
      >
        <div>
          <span style={{ color: 'black' }}>Price (USD):</span>${modalPrice}
        </div>
        <div>
          <span style={{ color: 'black' }}>About</span>
        </div>
        <div>
          {modalToken && abouts.find((x) => x.token === modalToken).about}
        </div>
      </Modal>
    </>
  )
}

export default App
