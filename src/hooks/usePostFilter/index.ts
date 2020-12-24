import { Post } from 'types'
import _ from 'lodash'

type Filters = {
  propName?: string
  showAll?: boolean
  maxPosts?: number
  postTags?: string[]
  strictTags?: boolean
}

const usePostFilter = <T extends Post>(
  posts: T[],
  settings: Filters | Filters[]
) => {
  const filterByPublished = (
    postsToFilter: T[],
    filters: Filters
  ) => {
    const { showAll } = filters

    if (!showAll) {
      postsToFilter = _.filter(
        postsToFilter,
        (post) => post.published
      )
    }

    return postsToFilter
  }

  const filterByMaxPosts = (postsToFilter: T[], filters: Filters) => {
    const { maxPosts } = filters

    if (maxPosts) {
      postsToFilter.length = maxPosts
    }

    return _.filter(postsToFilter, (post) => !!post)
  }

  const filterByPostTags = (postsToFilter: T[], filters: Filters) => {
    const { postTags, strictTags } = filters

    // Filter posts by postTags
    if (postTags && postTags.length > 0) {
      return _.filter(postsToFilter, (post) => {
        let included = false
        let done = false

        if (
          typeof postTags === 'string' &&
          post.tags.includes(postTags)
        ) {
          included = true
        } else if (Array.isArray(postTags)) {
          _.forEach(postTags, (tag) => {
            if (!done && post.tags.includes(tag)) {
              included = true
            }
            if (!done && strictTags && !post.tags.includes(tag)) {
              included = false
              done = true
            }
          })
        }

        return included
      })
    }

    return postsToFilter
  }

  const orderPosts = (postsToFilter: T[]) => {
    const orderedPosts: T[] = []
    const unorderedPosts: T[] = []

    // for (const post of postsToFilter) {
    _.forEach(postsToFilter, (post) => {
      let found = false

      // for (const tag of post.tags) {
      _.forEach(post.tags, (tag) => {
        if (!found && tag.includes('order-')) {
          // use index of a tag such as order-2 to be index 2
          orderedPosts[parseInt(_.split(tag, '-')[1])] = post
          found = true
        }
      })

      if (!found) {
        unorderedPosts.push(post)
      }
    })

    return _.filter(
      [...orderedPosts, ...unorderedPosts],
      (post) => !!post
    )
  }

  const filterPosts = (postsToFilter: T[], filters: Filters) => {
    postsToFilter = filterByPublished(postsToFilter, filters)
    postsToFilter = filterByPostTags(postsToFilter, filters)
    postsToFilter = orderPosts(postsToFilter)
    postsToFilter = filterByMaxPosts(postsToFilter, filters)

    return postsToFilter
  }

  // Begin the filtering
  const filtered: { [key: string]: T[] } = {}

  if (Array.isArray(settings)) {
    _.forEach(settings, (filters) => {
      if (filters.propName) {
        filtered[filters.propName] = filterPosts(posts, filters)
      }
    })
  } else {
    filtered['posts'] = filterPosts(posts, settings)
  }

  return filtered
}

export default usePostFilter
