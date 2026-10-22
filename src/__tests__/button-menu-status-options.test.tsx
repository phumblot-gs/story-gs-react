import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { ButtonMenuStatus } from "@/components/ui/button-menu-status"
import { MediaStatus } from "@/utils/mediaStatus"

afterEach(cleanup)

describe("ButtonMenuStatus options", () => {
  it("draws an option's own colour and gives the option back, without a current status", () => {
    const onOptionSelect = vi.fn()
    const onStatusChange = vi.fn()
    render(<ButtonMenuStatus defaultOpen onOptionSelect={onOptionSelect} onStatusChange={onStatusChange} statusOptions={[
      { value: "stuck", label: "Stuck", color: "rgb(164, 76, 159)" },
      { value: "done", label: "Done", color: "rgb(137, 204, 82)" },
    ]} />)
    const stuck = screen.getByRole("menuitem", { name: "Stuck" })
    expect((stuck.querySelector("span[aria-hidden]") as HTMLElement).style.background).toBe("rgb(164, 76, 159)")
    fireEvent.click(stuck)
    expect(onOptionSelect).toHaveBeenCalledWith(expect.objectContaining({ value: "stuck", label: "Stuck" }))
    expect(onStatusChange).not.toHaveBeenCalled() // not a media status
  })

  it("keeps media statuses as before: their colour, onStatusChange, and onOptionSelect too", () => {
    const onOptionSelect = vi.fn()
    const onStatusChange = vi.fn()
    render(<ButtonMenuStatus defaultOpen currentStatus={MediaStatus.SELECTED} onOptionSelect={onOptionSelect} onStatusChange={onStatusChange}
      statusOptions={[{ status: MediaStatus.VALIDATED, label: "Validated" }]} />)
    const validated = screen.getByRole("menuitem", { name: /Validated/ }) // the media status bar adds its own label to the name
    expect(validated.querySelector(".status-validated")).not.toBeNull()
    fireEvent.click(validated)
    expect(onStatusChange).toHaveBeenCalledWith(MediaStatus.VALIDATED)
    expect(onOptionSelect).toHaveBeenCalledWith(expect.objectContaining({ status: MediaStatus.VALIDATED }))
  })
})
