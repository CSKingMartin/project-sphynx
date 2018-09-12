import PropTypes from 'prop-types'
import React from 'react'

const Navigation = (props) => {
  const {
    archive,
    ItemLink
  } = props

  return (
    <ul>
      {
        archive.map(entry => (
          <li key={entry.id}>
            <ItemLink entry={entry} {...props} />
          </li>
        ))
      }
    </ul>
  )
}

Navigation.propTypes = {
  archive: PropTypes.arrayOf(PropTypes.object),
  ItemLink: PropTypes.func
}

export default Navigation
