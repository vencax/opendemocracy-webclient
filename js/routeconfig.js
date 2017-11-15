import React from 'react'
import { Route } from 'mobx-router'

import DashboardPage from './components/pages/dashboard'
import LoginPage from './components/pages/login'
import ProposalPage from './components/pages/proposal'
import ProposalEditPage from './components/pages/proposaledit'
import ProposalListPage from './components/pages/proposallist'

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
    onEnter: (route, params, store, queryParams) => {
      store.showProposal(params.id, Number(queryParams._page))
    },
    onParamsChange: (route, nextParams, store, nextQueryParams) => {
      store.loadComments(store.cv, store.cv.proposal, {page: Number(nextQueryParams._page), perPage: 2})
    }
  }),
  proposaledit: new Route({
    path: '/proposaledit/:id',
    component: <ProposalEditPage />,
    onEnter: (route, params, store) => store.editProposal(params.id)
  }),
  proposallist: new Route({
    path: '/proposallist',
    component: <ProposalListPage />,
    onEnter: (route, params, store, queryParams) => store.showProposalList(queryParams)
  })
}
export default views
