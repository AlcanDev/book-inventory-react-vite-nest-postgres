import React from 'react';

function Image(props: any) {
  const { src, alt, className, ...rest } = props as any;

  return (
    <img
      src={src as any}
      alt={alt as any}
      className={className as any}
      onError={(e: any) => {
        e.target.src = "/assets/images/no_image.png"
      }}
      {...rest}
    />
  );
}

export default Image;
