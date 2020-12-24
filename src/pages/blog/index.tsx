import { Blog } from 'types'
import React, { useContext, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'
import Link from 'next/link'
import { PageHead } from '@/components'
import { usePostFilter } from '@/hooks'
import { SectionStrip } from '@/Sections'
import { blogsContext, postsContext } from '@/context'
import styles from './blog.module.scss'

const BlogPage = () => {
  const { blogs, setBlogs } = useContext(blogsContext)

  useEffect(() => {
    const fetchBlogs = async () => {
      if (blogs.length === 0) {
        const { data: foundBlogs } = await axios.get(
          '/api/blogs/published'
        )
        setBlogs(foundBlogs)
      }
    }
    fetchBlogs()
  }, [])

  const settings = {
    maxPosts: 5,
  }
  const { posts: filteredBlogs } = usePostFilter(blogs, settings)

  const renderAllBlogsLink = () => {
    if (filteredBlogs.length === 5) {
      return (
        <Link href="/blog/all">
          <button className="button button-secondary">
            See all blog posts
          </button>
        </Link>
      )
    }
  }

  const renderDate = (post: Blog) => {
    const date =
      post.published && post.publishDate
        ? post.publishDate
        : post.created

    return <p>{moment(date).format('MMMM Do, YYYY')}</p>
  }

  const { posts } = useContext(postsContext)

  let headTitle = 'Blog'
  const headerSettings = {
    maxPosts: 1,
    postTags: ['section-header'],
  }
  const {
    posts: [headerPost],
  } = usePostFilter(posts, headerSettings)
  if (headerPost) {
    headTitle = `${headerPost.title} | ${headTitle}`
  }

  return (
    <div className={styles.blog}>
      <PageHead title={headTitle} />
      <SectionStrip
        posts={filteredBlogs}
        title="Blog"
        mediaLeft
        readMore
        path="blog"
        emptyMessage="There are no blogs yet."
        beforePostContent={renderDate}
        afterPosts={renderAllBlogsLink}
      />
    </div>
  )
}

export default BlogPage
