"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, TrendingDown, BarChart3, Users, FileText } from "lucide-react"

interface CSVData {
  Iteration: string
  BST0: string
  Triplet: string
  "Improvement %": string
}

export default function ProjectReport() {
  const [csvData, setCsvData] = useState<CSVData[]>([])
  const [loading, setLoading] = useState(true)
  const [averageData, setAverageData] = useState<CSVData[]>([])
  const [iterationData, setIterationData] = useState<CSVData[]>([])
  const [rangeSearchData, setRangeSearchData] = useState<
    {
      Iteration: string
      BST0_Operations: string
      Triplet_Operations: string
      "Improvement %": string
    }[]
  >([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/word_search_comparison_table-BIPcZ7ArUZR5LceuBe9h9lzosywwwW.csv",
        )
        const text = await response.text()

        const lines = text.split("\n").filter((line) => line.trim())
        const headers = lines[0].split(",")

        const data: CSVData[] = lines
          .slice(1)
          .map((line) => {
            const values = line.split(",")
            return {
              Iteration: values[0]?.trim() || "",
              BST0: values[1]?.trim() || "",
              Triplet: values[2]?.trim() || "",
              "Improvement %": values[3]?.trim() || "",
            }
          })
          .filter((row) => row.Iteration && row.BST0 && row.Triplet)

        setCsvData(data)

        // Separate average data from iteration data
        const avgData = data.filter((row) => row.Iteration.includes("Average"))
        const iterData = data.filter((row) => !row.Iteration.includes("Average"))

        setAverageData(avgData)
        setIterationData(iterData)

        // Fetch range search data
        const rangeResponse = await fetch(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/range_search_comparison-eKr7JqPnXYpdaifrjFbnGV0d03WFLb.csv",
        )
        const rangeText = await rangeResponse.text()
        const rangeLines = rangeText.split("\n").filter((line) => line.trim())

        const rangeData = rangeLines
          .slice(1)
          .map((line) => {
            const values = line.split(",")
            const bst0 = Number.parseFloat(values[1]?.trim() || "0")
            const triplet = Number.parseFloat(values[2]?.trim() || "0")
            const improvement = bst0 > 0 ? ((bst0 - triplet) / bst0) * 100 : 0

            return {
              Iteration: values[0]?.trim() || "",
              BST0_Operations: values[1]?.trim() || "",
              Triplet_Operations: values[2]?.trim() || "",
              "Improvement %": improvement.toFixed(4),
            }
          })
          .filter((row) => row.Iteration && row.BST0_Operations && row.Triplet_Operations)

        setRangeSearchData(rangeData)
      } catch (error) {
        console.error("Error fetching CSV data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const calculateStats = (data: CSVData[]) => {
    if (data.length === 0) return { avgImprovement: 0, maxImprovement: 0, minImprovement: 0 }

    const improvements = data.map((row) => Number.parseFloat(row["Improvement %"]) || 0)
    return {
      avgImprovement: improvements.reduce((a, b) => a + b, 0) / improvements.length,
      maxImprovement: Math.max(...improvements),
      minImprovement: Math.min(...improvements),
    }
  }

  const stats = calculateStats(iterationData)

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Binary Search Tree Performance Analysis</h1>
        <p className="text-xl text-gray-600">Comparative Study of BST Implementations</p>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>
              Practical work by: <strong>Omari Ahmed El-Amine</strong> and <strong>Azrine Said Readh</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            This report presents a comprehensive analysis of Binary Search Tree (BST) performance comparing standard BST
            implementation (BST0) with an optimized Triplet-based approach across multiple iterations and search
            categories.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.avgImprovement.toFixed(1)}%</div>
              <div className="text-sm text-green-700">Average Improvement</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.maxImprovement.toFixed(1)}%</div>
              <div className="text-sm text-blue-700">Maximum Improvement</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">10</div>
              <div className="text-sm text-orange-700">Test Iterations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Remarks */}
      <Card>
        <CardHeader>
          <CardTitle>Key Technical Remarks</CardTitle>
          <CardDescription>Important observations from the BST implementation analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-blue-900">BST2 Implementation</h4>
              <p className="text-gray-700">
                BST2 keeps the XYZ words in the middle levels of the tree, but additionally keeps words greater than XYZ
                near the root.
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-green-900">BST3 Implementation</h4>
              <p className="text-gray-700">
                BST3 keeps the XYZ words in the lower levels of the tree, but additionally keeps words lesser than XYZ
                near the root.
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-purple-900">Tree Navigation</h4>
              <p className="text-gray-700">
                Parent operation has been used to go up the tree, enabling efficient traversal and optimization of
                search operations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Charts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Analysis Charts
          </CardTitle>
          <CardDescription>Visual comparison of BST operations across different scenarios</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Average Operations by Search Category</h4>
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/stats_operations_by_category-8zXFQpz0F6341NmiaDT8LtTeR8ZDx5.png"
              alt="BST0 vs Triplet average operations by category"
              className="w-full rounded-lg border"
            />
            <p className="text-sm text-gray-600 mt-2">
              Performance comparison across different search categories: XYZ, Above, and Below word searches.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Range Search Operations</h4>
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/range_search_operations-mOq0vBtRuK1EZ63iwgvbqvPM0FPO1a.png"
              alt="BST operations per iteration for range search"
              className="w-full rounded-lg border"
            />
            <p className="text-sm text-gray-600 mt-2">
              Triplet implementation performance across iterations for range search operations.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Average Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Average Performance Summary</CardTitle>
            <CardDescription>Word search performance averages across all test categories</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading data...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">BST0</TableHead>
                    <TableHead className="text-right">Triplet</TableHead>
                    <TableHead className="text-right">Improvement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {averageData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.Iteration}</TableCell>
                      <TableCell className="text-right">{Number.parseFloat(row.BST0).toLocaleString()}</TableCell>
                      <TableCell className="text-right">{Number.parseFloat(row.Triplet).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={Number.parseFloat(row["Improvement %"]) > 0 ? "default" : "secondary"}>
                          {Number.parseFloat(row["Improvement %"]).toFixed(1)}%
                          {Number.parseFloat(row["Improvement %"]) > 0 ? (
                            <TrendingUp className="ml-1 h-3 w-3" />
                          ) : (
                            <TrendingDown className="ml-1 h-3 w-3" />
                          )}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Range Search Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Range Search Results</CardTitle>
            <CardDescription>Range search simulation performance data</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading data...</div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Iteration</TableHead>
                      <TableHead className="text-right">BST0 Operations</TableHead>
                      <TableHead className="text-right">Triplet Operations</TableHead>
                      <TableHead className="text-right">Improvement</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rangeSearchData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{row.Iteration}</TableCell>
                        <TableCell className="text-right">
                          {Number.parseFloat(row.BST0_Operations).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {Number.parseFloat(row.Triplet_Operations).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={Number.parseFloat(row["Improvement %"]) > 0 ? "default" : "secondary"}>
                            {Number.parseFloat(row["Improvement %"]).toFixed(3)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Complete Dataset Table */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Word Search Dataset</CardTitle>
          <CardDescription>Full word search comparison table with all test results</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading complete dataset...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Test Case</TableHead>
                    <TableHead className="text-right">BST0 Operations</TableHead>
                    <TableHead className="text-right">Triplet Operations</TableHead>
                    <TableHead className="text-right">Performance Improvement</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvData.map((row, index) => {
                    const improvement = Number.parseFloat(row["Improvement %"])
                    const isAverage = row.Iteration.includes("Average")

                    return (
                      <TableRow key={index} className={isAverage ? "bg-gray-50 font-medium" : ""}>
                        <TableCell className="font-medium">
                          {row.Iteration}
                          {isAverage && (
                            <Badge variant="outline" className="ml-2">
                              Summary
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">{Number.parseFloat(row.BST0).toLocaleString()}</TableCell>
                        <TableCell className="text-right">{Number.parseFloat(row.Triplet).toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <span className={improvement > 0 ? "text-green-600" : "text-red-600"}>
                            {improvement.toFixed(2)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {improvement > 0 ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <TrendingUp className="mr-1 h-3 w-3" />
                              Improved
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <TrendingDown className="mr-1 h-3 w-3" />
                              Degraded
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conclusions */}
      <Card>
        <CardHeader>
          <CardTitle>Conclusions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            The analysis demonstrates that the Triplet-based BST implementation shows significant performance
            improvements over the standard BST0 implementation, with an average improvement of{" "}
            {stats.avgImprovement.toFixed(1)}% across all test iterations.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Key Findings:</h4>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Consistent performance improvements across most test scenarios</li>
              <li>Effective optimization through strategic word placement in tree levels</li>
              <li>Successful implementation of parent operations for tree traversal</li>
              <li>Robust performance across different search categories (XYZ, Above, Below)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        <p>Report generated from performance analysis data • Binary Search Tree Optimization Study</p>
        <p className="mt-1">Authors: Omari Ahmed El-Amine & Azrine Said Readh</p>
      </div>
    </div>
  )
}
