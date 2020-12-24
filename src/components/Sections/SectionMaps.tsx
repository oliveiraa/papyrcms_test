import { SectionOptions, Post } from 'types'
import React from 'react'
import _ from 'lodash'
import renderHTML from 'react-render-html'
import { Map } from '@/components'

type Props = {
  posts: Post[]
  emptyTitle?: string
  emptyMessage?: string
  mapLocation?: string
}

/**
 * SectionMaps will render a section with some text and a
 * google map at a particular location
 *
 * @prop mapLocation - String('start' or 'end') - renders the map before or after the content
 * @prop posts - Array[Object - latitude, longitude, and content posts]
 */
const SectionMaps: React.FC<Props> = (props) => {
  const {
    posts,
    emptyTitle,
    emptyMessage,
    mapLocation = 'start',
  } = props

  let latitudePost: Post
  let longitudePost: Post
  let contentPost: Post

  // Pick out the text, latitude, and logitude posts
  _.forEach(posts, (post) => {
    switch (true) {
      case post.tags.includes('latitude'):
        latitudePost = post
        break
      case post.tags.includes('longitude'):
        longitudePost = post
        break
      default:
        contentPost = post
    }
  })

  // If we don't have all the info we need
  // @ts-ignore posts are assgned in the forEach
  if (!contentPost || !longitudePost || !latitudePost) {
    return (
      <section className="section-maps">
        <h2 className="heading-secondary">{emptyTitle}</h2>
        <h3 className="heading-tertiary">{emptyMessage}</h3>
      </section>
    )
  }

  // Get our coordinates
  const latitude = parseFloat(latitudePost.title)
  const longitude = parseFloat(longitudePost.title)

  const renderMap = () => {
    return <Map latitude={latitude} longitude={longitude} zoom={15} />
  }

  const { title, content } = contentPost

  return (
    <section className="section-maps">
      <h2 className="heading-secondary section-maps__title">
        {title}
      </h2>

      <div className="section-maps__content">
        {mapLocation === 'start' ? renderMap() : null}

        <div className="section-maps__text">
          <div className="section-maps__subtext">
            {renderHTML(content)}
          </div>
        </div>

        {mapLocation === 'end' ? renderMap() : null}
      </div>
    </section>
  )
}

export const options: SectionOptions = {
  Map: {
    component: 'SectionMaps',
    name: 'Map Section',
    description:
      'This section will display a google map at the location specified by the latitude and longitude posts, along with the content of the main post.',
    inputs: ['className', 'tags', 'title'],
    maxPosts: 3,
    defaultProps: {
      mapLocation: 'end',
    },
  },
}

export default SectionMaps
