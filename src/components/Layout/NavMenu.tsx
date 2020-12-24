import React, { useContext } from 'react'
import _ from 'lodash'
import Link from 'next/link'
import { settingsContext, pagesContext } from '@/context'

const onClick = () => {
  const checkbox = document.getElementById('nav-menu-checkbox')
  checkbox?.classList.toggle('checked')
}

type LinkProps = {
  exact?: boolean
  href: string
  title?: string
  children: string
}

const NavLink: React.FC<LinkProps> = (props) => {
  let href
  if (props.exact) {
    href = props.href
  } else {
    href = props.href === '/' ? '/' : '/[page]'
  }

  return (
    <Link href={href} as={props.href}>
      <a
        className="nav-menu__item"
        title={props.title || props.children}
      >
        <li onClick={onClick}>{props.children}</li>
      </a>
    </Link>
  )
}

/**
 * NavMenu displayed at the top of every view.
 *
 * @prop logo - String - The source for the logo image displayed at the top right
 */
const NavMenu: React.FC<{ logo?: string }> = (props) => {
  const { pages } = useContext(pagesContext)
  const { settings } = useContext(settingsContext)

  const renderBlogItem = () => {
    if (settings.enableBlog) {
      return (
        <NavLink href="/blog" exact>
          Blog
        </NavLink>
      )
    }
  }

  const renderEventsItem = () => {
    if (settings.enableEvents) {
      return (
        <NavLink href="/events" exact>
          Events
        </NavLink>
      )
    }
  }

  const renderStoreItem = () => {
    if (settings['enableStore']) {
      return (
        <NavLink href="/store" exact>
          Store
        </NavLink>
      )
    }
  }

  const renderFirstMenuItems = () => {
    const navPages = _.filter(pages, (page) => {
      return (
        page.navOrder &&
        page.navOrder !== 0 &&
        page.navOrder <= 5 &&
        page.title
      )
    }).sort((a, b) =>
      typeof a === 'object' &&
      typeof b === 'object' &&
      a.navOrder > b.navOrder
        ? 1
        : -1
    )

    return _.map(navPages, (page) => {
      if (typeof page === 'object') {
        const href = page.route === 'home' ? '/' : `/${page.route}`
        return (
          <NavLink href={href} key={page._id}>
            {page.title}
          </NavLink>
        )
      }
    })
  }

  const renderLastMenuItems = () => {
    const navPages = _.filter(pages, (page) => {
      return page.navOrder && page.navOrder > 5 && page.title
    }).sort((a, b) =>
      typeof a === 'object' &&
      typeof b === 'object' &&
      a.navOrder > b.navOrder
        ? 1
        : -1
    )

    return _.map(navPages, (page) => {
      if (typeof page === 'object') {
        const href = page.route === 'home' ? '/' : `/${page.route}`
        return (
          <NavLink href={href} key={page._id}>
            {page.title}
          </NavLink>
        )
      }
    })
  }

  const renderLogo = () => {
    if (props.logo) {
      return (
        <Link href="/">
          <a title="Home">
            <div className="nav-menu__logo">
              <img src={props.logo} alt="site logo" />
            </div>
          </a>
        </Link>
      )
    }
  }

  return (
    <nav>
      <ul className="nav-menu">
        {renderLogo()}

        <div className="nav-menu__items" id="nav-menu-checkbox">
          <span
            onClick={onClick}
            className="nav-menu__item nav-menu__item--hamburger"
          />

          {renderFirstMenuItems()}
          {renderBlogItem()}
          {renderEventsItem()}
          {renderStoreItem()}
          {renderLastMenuItems()}
        </div>
      </ul>
    </nav>
  )
}

export default NavMenu
