import React from 'react';

type StaticImport = {
    src: string;
};

interface NextImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    src: string | StaticImport;
    alt: string;
    fill?: boolean;
    priority?: boolean;
    quality?: number;
    unoptimized?: boolean;
}

const NextImage = React.forwardRef<HTMLImageElement, NextImageProps>(function NextImage(
    {
        src,
        alt,
        fill,
        style,
        width,
        height,
        ...rest
    },
    ref,
) {
    const resolvedSrc = typeof src === 'string' ? src : src.src;

    if (fill) {
        return (
            <img
                {...rest}
                ref={ref}
                src={resolvedSrc}
                alt={alt}
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    ...style,
                }}
            />
        );
    }

    return (
        <img
            {...rest}
            ref={ref}
            src={resolvedSrc}
            alt={alt}
            width={width}
            height={height}
            style={style}
        />
    );
});

export default NextImage;
