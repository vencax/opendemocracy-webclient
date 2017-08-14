import React from 'react'
import {MobxRouter} from 'mobx-router'
import {observer, Provider} from 'mobx-react'

import Menu from './menu'

export const App = observer(({store}) => {
  return (
    <section className={'view-wrapper container-fluid'}>
      <div className='row' style={{width: '100%'}}>
        <Menu store={store} />
        <div className='main' style={{marginTop: '4em'}}>
          <Provider store={store}>
            <MobxRouter />
          </Provider>
        </div>
      </div>
    </section>
  )
})
