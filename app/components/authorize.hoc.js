import React, { Component, PropTypes } from 'react'
import { observer } from 'mobx-react'

/**
  Require Auth HOC
 */
export const authorize = ComposedComponent =>
  observer(class Auth extends Component {

    static propTypes = {
      store: PropTypes.object,
    }

    static contextTypes = {
      router: PropTypes.object.isRequired,
    }

    static fetchData(data) {
      return ComposedComponent.fetchData(data)
    }

    componentWillMount() {
      const { store } = this.props
      const { router } = this.context

      if (global.TYPE === 'CLIENT') {
        if (!store.authenticate()) {
          //const currentPath = location.pathname
          //store.auth.redirect = currentPath
          router.push('/')
        }
      }
    }

    render() {
      return (
        this.props.store.authenticate() &&
          <ComposedComponent {...this.props} />
      );
    }
  });
