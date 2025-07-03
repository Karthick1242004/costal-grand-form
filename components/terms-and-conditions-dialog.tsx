"use client"

import { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface TermsAndConditionsDialogProps {
  isOpen: boolean
  onAccept: () => void
  onClose: () => void
}

const TERMS_AND_CONDITIONS_TEXT = `
Welcome to the Coastal Grand Hotel Membership Program! By becoming a member, you agree to the following terms and conditions. Please read them carefully.

1.  **Membership Eligibility:** Membership is open to individuals aged 18 years or older. The Coastal Grand Hotel reserves the right to refuse or revoke membership at its sole discretion.

2.  **Membership Benefits:** Membership benefits are subject to change without prior notice. Benefits may include, but are not limited to, discounted room rates, exclusive access to hotel facilities, special offers, and loyalty points. Specific benefits depend on your chosen membership tier (Bronze, Silver, Gold, Platinum).

3.  **Membership Tiers:**
    *   **Bronze:** Basic discounts, newsletter access.
    *   **Silver:** Enhanced discounts, early check-in/late check-out (subject to availability).
    *   **Gold:** Premium discounts, complimentary breakfast, room upgrades (subject to availability).
    *   **Platinum:** VIP treatment, dedicated concierge, executive lounge access, complimentary airport transfers.

4.  **Data Privacy:** We are committed to protecting your privacy. All personal information collected will be used in accordance with our Privacy Policy, available on our website. By signing up, you consent to the collection and use of your data as described therein.

5.  **Membership Fees:** Some membership tiers may require an annual fee. Fees are non-refundable unless otherwise stated.

6.  **Cancellation:** You may cancel your membership at any time by contacting our membership services. No refunds will be issued for partial membership periods.

7.  **Changes to Terms:** The Grand Hotel reserves the right to modify these terms and conditions at any time. Members will be notified of significant changes via email or through our website. Continued use of membership after changes constitutes acceptance of the new terms.

8.  **Limitation of Liability:** The Grand Hotel shall not be liable for any loss, damage, or injury arising from your participation in the membership program, except where prohibited by law.

9.  **Governing Law:** These terms and conditions shall be governed by and construed in accordance with the laws of the jurisdiction where the Grand Hotel is located.

10. **Contact:** For any questions regarding your membership or these terms, please contact our membership services department.

By clicking "I Accept" below, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
`

export function TermsAndConditionsDialog({ isOpen, onAccept, onClose }: TermsAndConditionsDialogProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    const element = scrollAreaRef.current?.querySelector("[data-radix-scroll-area-viewport]")
    if (element) {
      const { scrollTop, scrollHeight, clientHeight } = element
      const tolerance = 5 // Increase tolerance for better detection
      if (scrollHeight - scrollTop <= clientHeight + tolerance) {
        setHasScrolledToBottom(true)
      }
    }
  }

  useEffect(() => {
    if (isOpen) {
      // Reset scroll state when dialog opens
      setHasScrolledToBottom(false)
      
      const checkScrollable = () => {
        const element = scrollAreaRef.current?.querySelector("[data-radix-scroll-area-viewport]")
        if (element) {
          const { scrollHeight, clientHeight } = element
          // If content is not scrollable (fits in view), automatically enable accept button
          if (scrollHeight <= clientHeight + 10) {
            setHasScrolledToBottom(true)
          } else {
            element.addEventListener("scroll", handleScroll)
            // Check initial scroll position
            handleScroll()
          }
        }
      }

      // Delay check to ensure content is rendered
      const timer = setTimeout(checkScrollable, 100)
      
      return () => {
        clearTimeout(timer)
        const element = scrollAreaRef.current?.querySelector("[data-radix-scroll-area-viewport]")
        if (element) {
          element.removeEventListener("scroll", handleScroll)
        }
      }
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200 dark:border-slate-700">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            Terms and Conditions
          </DialogTitle>
          <DialogDescription className="text-base text-slate-600 dark:text-slate-400">
            Please read the following terms and conditions carefully before proceeding.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea
          className="flex-grow h-[450px] border border-slate-200 dark:border-slate-700 rounded-lg p-6 bg-white/50 dark:bg-slate-800/50"
          ref={scrollAreaRef}
        >
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {TERMS_AND_CONDITIONS_TEXT}
            </p>
          </div>
        </ScrollArea>
        <DialogFooter className="pt-4">
          <div className="flex items-center gap-3 w-full">
            {!hasScrolledToBottom && (
              <Badge
                variant="outline"
                className="text-xs bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
              >
                Please scroll to the bottom to continue
              </Badge>
            )}
            <div className="flex gap-2 ml-auto">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onAccept()
                }}
                disabled={!hasScrolledToBottom}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                I Accept
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
