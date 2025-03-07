import * as ModalPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';
import { ModalProps } from './interface';

import { XCircle } from 'lucide-react';
import { cn } from '~/lib/utils';   

const Modal = ModalPrimitive.Root;

const ModalTrigger = ModalPrimitive.Trigger;

const ModalPortal = ModalPrimitive.Portal;

const ModalClose = ModalPrimitive.Close;

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof ModalPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof ModalPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <ModalPrimitive.Overlay
    ref={ref}
    className={cn(
      'flex justify-center items-center fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
ModalOverlay.displayName = ModalPrimitive.Overlay.displayName;

const ModalCenter = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ className, children, closeButton = true, ...props }, ref) => {
    const closeMargin = closeButton ? 'pt-16' : '';
    return (
      <ModalPortal>
        <ModalOverlay>
          <div
            ref={ref}
            className={cn(
              'relative flex flex-col gap-3 w-[289px] md:w-[388px] rounded-[24px] p-10 bg-cyan-50 border border-component-light-border dark:border-component-dark-border',
              className,
              closeMargin
            )}
            {...props}
          >
            {closeButton && (
              <ModalPrimitive.Close className="top-4 right-4 absolute">
                <XCircle
                  size={32}
                  className="text-component-light-border dark:text-component-dark-border"
                />
              </ModalPrimitive.Close>
            )}
            {children}
          </div>
        </ModalOverlay>
      </ModalPortal>
    );
  }
);
ModalCenter.displayName = 'ModalCenter';

const ModalContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('font-geologica text-neutral-500', className)}
    {...props}
  />
));
ModalContent.displayName = 'ModalContent';

const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('font-tilt-warp text-black dark:text-white', className)}
    {...props}
  />
));
ModalHeader.displayName = 'ModalHeader';

export {
  Modal,
  ModalCenter,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalPortal,
  ModalTrigger,
};
