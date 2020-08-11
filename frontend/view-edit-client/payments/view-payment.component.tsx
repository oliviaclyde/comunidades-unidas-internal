import React from "react";
import { CreatePaymentStepProps } from "./create-payment.component";
import BasicTableReport from "../../reports/shared/basic-table-report.component";
import dayjs from "dayjs";
import { humanReadablePaymentType } from "./edit-payment.component";

export default function ViewPayment(props: CreatePaymentStepProps) {
  return (
    <div style={{ marginBottom: "2.4rem" }}>
      <BasicTableReport
        title="Payment Details"
        headerRows={<></>}
        contentRows={
          <>
            <tr>
              <th>Payer</th>
              <td>{props.client.fullName}</td>
            </tr>
            <tr>
              <th>Date</th>
              <td>{dayjs(props.payment.paymentDate).format("MMM DD, YYYY")}</td>
            </tr>
            <tr>
              <th>Invoices</th>
              <td>
                {props.payment.invoices.length > 0
                  ? props.payment.invoices
                      .map(
                        (i) =>
                          `#${
                            props.invoices.find((j) => j.id === i.invoiceId)
                              .invoiceNumber
                          }`
                      )
                      .join(", ")
                  : "(None)"}
              </td>
            </tr>
            <tr>
              <th>Method</th>
              <td>{humanReadablePaymentType(props.payment.paymentType)}</td>
            </tr>
          </>
        }
        footerRows={
          <>
            <tr>
              <th>Amount</th>
              <td>${props.payment.paymentAmount.toFixed(2)}</td>
            </tr>
          </>
        }
      />
    </div>
  );
}

ViewPayment.nextButtonText = "Create Payment";