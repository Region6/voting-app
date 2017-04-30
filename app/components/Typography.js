import React, {PropTypes} from 'react';
import cx from 'classnames';
import cs from '../styles/components/Typography.scss';

/**
 * Material-UI doesn't expose the Material Design typography in the
 * current stable version, but the upcoming major version does so
 * (https://github.com/callemall/material-ui/blob/next/src/Text/Text.js).
 * As the upcoming relase is currently in alpha version, this
 * component is back-ported so its API can already be used.
 * This should make an upgrade to the upcoming release easier.
 */

const propTypes = {
  align: PropTypes.oneOf([
    'left',
    'center',
    'right',
    'justify'
  ]),
  children: PropTypes.node,
  className: PropTypes.string,
  colorInherit: PropTypes.bool,
  component: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
  gutterBottom: PropTypes.bool,
  noWrap: PropTypes.bool,
  paragraph: PropTypes.bool,
  secondary: PropTypes.bool,
  type: PropTypes.oneOf([
    'display4',
    'display3',
    'display2',
    'display1',
    'headline',
    'title',
    'subheading',
    'body2',
    'body1',
    'caption',
    'button'
  ])
};

const defaultProps = {
  colorInherit: false,
  component: 'span',
  gutterBottom: false,
  noWrap: false,
  paragraph: false,
  secondary: false,
  type: 'body1'
};

const contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

const Typography = ({
  align,
  children,
  className,
  colorInherit,
  component,
  gutterBottom,
  noWrap,
  paragraph,
  secondary,
  type
}, {muiTheme}) => {
  const renderClassName = cx(cs.root, cs[type], {
    [cs.root_colorInherit]: colorInherit,
    [cs.root_noWrap]: noWrap,
    [cs.root_secondary]: secondary,
    [cs.root_paragraph]: paragraph,
    [cs.root_gutterBottom]: gutterBottom,
    [cs.root_paragraph]: paragraph,
    [cs[`root_${align}`]]: align
  }, className);

  const style = {};

  if (['display4', 'display3', 'display2', 'display1', 'caption'].includes(type)) {
    style.color = muiTheme.palette.secondaryTextColor;
  } else if (['headline', 'title', 'subheading', 'body2', 'body1'].includes(type)) {
    style.color = muiTheme.palette.primary;
  }

  if (secondary) style.color = muiTheme.palette.secondaryTextColor;

  const Component = paragraph ? 'p' : component;

  return (
    <Component
      style={style}
      className={renderClassName}
      children={children}
    />
  );
};

Typography.propTypes = propTypes;
Typography.defaultProps = defaultProps;
Typography.contextTypes = contextTypes;
export default Typography;