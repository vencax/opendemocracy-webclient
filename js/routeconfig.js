import React from 'react'
import { Route } from 'mobx-router'

import DashboardPage from './components/pages/dashboard'
import LoginPage from './components/pages/login'
import ProposalPage from './components/pages/proposal'

const views = {
  dashboard: new Route({
    path: '/',
    component: <DashboardPage />,
    beforeEnter: (route, params, store) => store.showDashboard()
  }),
  login: new Route({
    path: '/login',
    component: <LoginPage />,
    beforeEnter: (route, params, store) => store.showLogin()
  }),
  proposal: new Route({
    path: '/proposal/:id',
    component: <ProposalPage />,
    onEnter: (route, params, store) => store.showProposal(params.id)
  })
}
export default views
